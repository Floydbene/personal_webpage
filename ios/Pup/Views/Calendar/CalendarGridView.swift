import SwiftUI

struct CalendarGridView: View {
    let dates: [Date]
    let blocks: [ScheduleBlock]
    let tickets: [Ticket]
    @Binding var selectedDate: Date?
    @Environment(\.appTheme) private var theme

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 4), count: 7)
    private let dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    var body: some View {
        VStack(spacing: 4) {
            // Day-of-week headers
            LazyVGrid(columns: columns, spacing: 4) {
                ForEach(dayHeaders, id: \.self) { day in
                    Text(day)
                        .font(.caption2)
                        .fontWeight(.semibold)
                        .foregroundStyle(theme.textMuted)
                        .frame(maxWidth: .infinity)
                }
            }

            // Day cells
            LazyVGrid(columns: columns, spacing: 4) {
                ForEach(dates, id: \.timeIntervalSinceReferenceDate) { date in
                    CalendarDayCell(
                        date: date,
                        blocks: blocksFor(date),
                        ticketCount: ticketCountFor(date),
                        isToday: Calendar.current.isDateInToday(date),
                        isSelected: selectedDate.map { Calendar.current.isDate($0, inSameDayAs: date) } ?? false
                    )
                    .onTapGesture {
                        selectedDate = date
                    }
                }
            }
        }
    }

    private func blocksFor(_ date: Date) -> [ScheduleBlock] {
        let calendar = Calendar.current
        let target = calendar.startOfDay(for: date)
        return blocks.filter { block in
            guard let start = block.startDateParsed, let end = block.endDateParsed else { return false }
            return target >= calendar.startOfDay(for: start) && target <= calendar.startOfDay(for: end)
        }
    }

    private func ticketCountFor(_ date: Date) -> Int {
        let calendar = Calendar.current
        let target = calendar.startOfDay(for: date)
        return tickets.filter { ticket in
            guard let dueDate = ticket.dueDate else { return false }
            return calendar.startOfDay(for: dueDate) == target
        }.count
    }
}
