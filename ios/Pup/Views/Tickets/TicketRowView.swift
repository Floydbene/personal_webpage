import SwiftUI

struct TicketRowView: View {
    let ticket: Ticket
    let displayName: (String?) -> String
    @Environment(\.appTheme) private var theme

    private var isCompleted: Bool {
        ticket.status == "done" || ticket.status == "closed"
    }

    private var priorityColor: Color {
        switch ticket.priority {
        case "low": Color(hex: "#22c55e")
        case "medium": Color(hex: "#3b82f6")
        case "high": Color(hex: "#f97316")
        case "urgent": Color(hex: "#ef4444")
        default: Color(hex: "#3b82f6")
        }
    }

    var body: some View {
        HStack(spacing: 14) {
            // Gradient priority bar
            RoundedRectangle(cornerRadius: 2)
                .fill(
                    LinearGradient(
                        colors: [priorityColor.opacity(0.8), priorityColor.opacity(0.4)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .frame(width: 4)

            VStack(alignment: .leading, spacing: 4) {
                Text(ticket.title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(isCompleted ? theme.textMuted : theme.text)
                    .strikethrough(isCompleted)

                HStack(spacing: 8) {
                    StatusBadge(status: ticket.status)

                    if let assignee = ticket.assignedTo {
                        HStack(spacing: 4) {
                            Text(String(displayName(assignee).prefix(1)).uppercased())
                                .font(.system(size: 9, weight: .bold))
                                .foregroundStyle(.white)
                                .frame(width: 16, height: 16)
                                .background(theme.primaryGradient, in: Circle())
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
        .premiumCard()
    }
}
