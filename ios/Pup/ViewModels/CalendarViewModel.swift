import Foundation
import Supabase

@Observable
final class CalendarViewModel {
    var scheduleBlocks: [ScheduleBlock] = []
    var tickets: [Ticket] = []
    var selectedDate: Date = Date()
    var isLoading = false
    var error: String?

    private let auth: AuthManager

    init(auth: AuthManager) {
        self.auth = auth
    }

    var calendarDates: [Date] {
        let calendar = Calendar.current
        let today = Date()
        // Find Monday of the current week
        let weekday = calendar.component(.weekday, from: today)
        let daysToMonday = (weekday == 1) ? -6 : (2 - weekday)
        guard let monday = calendar.date(byAdding: .day, value: daysToMonday, to: today) else { return [] }

        return (0..<28).compactMap { offset in
            calendar.date(byAdding: .day, value: offset, to: monday)
        }
    }

    func blocks(for date: Date) -> [ScheduleBlock] {
        let calendar = Calendar.current
        return scheduleBlocks.filter { block in
            guard let start = block.startDateParsed, let end = block.endDateParsed else { return false }
            let dayStart = calendar.startOfDay(for: start)
            let dayEnd = calendar.startOfDay(for: end)
            let target = calendar.startOfDay(for: date)
            return target >= dayStart && target <= dayEnd
        }
    }

    func ticketsDue(on date: Date) -> [Ticket] {
        let calendar = Calendar.current
        let target = calendar.startOfDay(for: date)
        return tickets.filter { ticket in
            guard let dueDate = ticket.dueDate else { return false }
            return calendar.startOfDay(for: dueDate) == target
        }
    }

    @MainActor
    func loadData() async {
        isLoading = true
        error = nil
        do {
            async let blocksTask: [ScheduleBlock] = auth.client.from("schedule_blocks")
                .select()
                .order("start_date", ascending: true)
                .execute()
                .value

            async let ticketsTask: [Ticket] = auth.client.from("tickets")
                .select()
                .not("due_date", operator: .is, value: "null")
                .order("due_date", ascending: true)
                .execute()
                .value

            scheduleBlocks = try await blocksTask
            tickets = try await ticketsTask
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    @MainActor
    func createBlock(title: String, startDate: String, endDate: String, description: String? = nil, color: String? = nil, ticketId: String? = nil) async {
        guard let userId = auth.userId, let email = auth.userEmail else { return }
        let payload = CreateScheduleBlockPayload(
            userId: userId,
            title: title,
            startDate: startDate,
            endDate: endDate,
            createdBy: email,
            description: description,
            color: color,
            ticketId: ticketId
        )
        do {
            try await auth.client.from("schedule_blocks")
                .insert(payload)
                .execute()
            await loadData()
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func updateBlock(id: String, fields: UpdateScheduleBlockPayload) async {
        do {
            var payload = fields
            let isoFormatter = ISO8601DateFormatter()
            isoFormatter.formatOptions = [.withInternetDateTime]
            payload.updatedAt = isoFormatter.string(from: Date())

            try await auth.client.from("schedule_blocks")
                .update(payload)
                .eq("id", value: id)
                .execute()
            await loadData()
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func deleteBlock(id: String) async {
        do {
            try await auth.client.from("schedule_blocks")
                .delete()
                .eq("id", value: id)
                .execute()
            scheduleBlocks.removeAll { $0.id == id }
        } catch {
            self.error = error.localizedDescription
        }
    }
}
