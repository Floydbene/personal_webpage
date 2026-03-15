import SwiftUI

struct StatusBadge: View {
    let status: String
    @Environment(\.appTheme) private var theme

    private var label: String {
        switch status {
        case "open": "Open"
        case "in_progress": "In Progress"
        case "done": "Done"
        case "closed": "Closed"
        default: status
        }
    }

    private var badgeColor: Color {
        switch status {
        case "open": Color(hex: "#3b82f6")
        case "in_progress": Color(hex: "#f59e0b")
        case "done": Color(hex: "#22c55e")
        case "closed": Color(hex: "#6b7280")
        default: Color(hex: "#6b7280")
        }
    }

    var body: some View {
        Text(label)
            .font(.caption2)
            .fontWeight(.medium)
            .foregroundStyle(badgeColor)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(badgeColor.opacity(0.15), in: Capsule())
    }
}
