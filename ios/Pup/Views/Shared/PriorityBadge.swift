import SwiftUI

struct PriorityBadge: View {
    let priority: String

    private var color: Color {
        switch priority {
        case "low": Color(hex: "#22c55e")
        case "medium": Color(hex: "#3b82f6")
        case "high": Color(hex: "#f97316")
        case "urgent": Color(hex: "#ef4444")
        default: Color(hex: "#3b82f6")
        }
    }

    var body: some View {
        RoundedRectangle(cornerRadius: 2)
            .fill(color)
            .frame(width: 4)
    }
}
