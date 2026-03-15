import Foundation
import Supabase

enum TicketFilter: String, CaseIterable {
    case active = "Active"
    case open = "Open"
    case inProgress = "In Progress"
    case done = "Done"
    case all = "All"

    func matches(_ ticket: Ticket) -> Bool {
        switch self {
        case .active:
            return ticket.status == "open" || ticket.status == "in_progress"
        case .open:
            return ticket.status == "open"
        case .inProgress:
            return ticket.status == "in_progress"
        case .done:
            return ticket.status == "done" || ticket.status == "closed"
        case .all:
            return true
        }
    }
}

@Observable
final class TicketsViewModel {
    var tickets: [Ticket] = []
    var users: [UserListItem] = []
    var activeFilter: TicketFilter = .active
    var isLoading = false
    var error: String?

    private let auth: AuthManager

    init(auth: AuthManager) {
        self.auth = auth
    }

    var filteredTickets: [Ticket] {
        tickets.filter { activeFilter.matches($0) }
    }

    func count(for filter: TicketFilter) -> Int {
        tickets.filter { filter.matches($0) }.count
    }

    func displayName(for email: String?) -> String {
        guard let email else { return "" }
        if let user = users.first(where: { $0.email == email }), let name = user.displayName {
            return name
        }
        return email.components(separatedBy: "@").first ?? email
    }

    @MainActor
    func loadTickets() async {
        isLoading = true
        error = nil
        do {
            tickets = try await auth.client.from("tickets")
                .select()
                .order("created_at", ascending: false)
                .execute()
                .value
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    @MainActor
    func loadUsers() async {
        do {
            users = try await auth.client.rpc("get_users")
                .execute()
                .value
        } catch {
            // Silently fail for users list
        }
    }

    @MainActor
    func createTicket(title: String) async {
        guard let userId = auth.userId, let email = auth.userEmail else { return }
        let payload = CreateTicketPayload(
            userId: userId,
            title: title,
            status: "open",
            createdBy: email,
            assignedTo: email
        )
        do {
            try await auth.client.from("tickets")
                .insert(payload)
                .execute()
            await loadTickets()
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func updateTicket(id: String, fields: UpdateTicketPayload) async {
        do {
            var payload = fields
            let isoFormatter = ISO8601DateFormatter()
            isoFormatter.formatOptions = [.withInternetDateTime]
            payload.updatedAt = isoFormatter.string(from: Date())

            if let status = fields.status {
                if status == "done" || status == "closed" {
                    payload.closedAt = isoFormatter.string(from: Date())
                    payload.completedBy = auth.userEmail
                    payload.completed = true
                } else {
                    payload.closedAt = nil
                    payload.completedBy = nil
                    payload.completed = false
                }
            }

            try await auth.client.from("tickets")
                .update(payload)
                .eq("id", value: id)
                .execute()
            await loadTickets()
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func deleteTicket(id: String) async {
        do {
            try await auth.client.from("tickets")
                .delete()
                .eq("id", value: id)
                .execute()
            tickets.removeAll { $0.id == id }
        } catch {
            self.error = error.localizedDescription
        }
    }
}
