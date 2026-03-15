import SwiftUI

struct TicketRowView: View {
    let ticket: Ticket
    let displayName: (String?) -> String
    @Environment(\.appTheme) private var theme

    var body: some View {
        HStack(spacing: 12) {
            PriorityBadge(priority: ticket.priority)

            VStack(alignment: .leading, spacing: 4) {
                Text(ticket.title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(
                        (ticket.status == "done" || ticket.status == "closed")
                        ? theme.textMuted : theme.text
                    )
                    .strikethrough(ticket.status == "done" || ticket.status == "closed")

                HStack(spacing: 8) {
                    StatusBadge(status: ticket.status)

                    if let assignee = ticket.assignedTo {
                        HStack(spacing: 4) {
                            Text(String(displayName(assignee).prefix(1)).uppercased())
                                .font(.system(size: 9, weight: .bold))
                                .foregroundStyle(.white)
                                .frame(width: 16, height: 16)
                                .background(theme.primary, in: Circle())
                            Text(displayName(assignee))
                                .font(.caption2)
                                .foregroundStyle(theme.textMuted)
                        }
                    }

                    TimeAgoText(date: ticket.createdAt)

                    if let dueDate = ticket.dueDate {
                        Text(dueDate.shortDate)
                            .font(.caption2)
                            .foregroundStyle(
                                dueDate.isOverdue(status: ticket.status)
                                ? Color(hex: "#ef4444") : theme.textMuted
                            )
                    }
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(theme.textMuted)
        }
        .padding(.vertical, 10)
        .padding(.horizontal, 12)
        .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 10))
    }
}
