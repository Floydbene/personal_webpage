import SwiftUI

struct CalendarDayCell: View {
    let date: Date
    let blocks: [ScheduleBlock]
    let ticketCount: Int
    let isToday: Bool
    let isSelected: Bool
    @Environment(\.appTheme) private var theme

    private var dayNumber: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d"
        return formatter.string(from: date)
    }

    var body: some View {
        VStack(spacing: 4) {
            Text(dayNumber)
                .font(.caption)
                .fontWeight(isToday ? .bold : .regular)
                .foregroundStyle(isToday ? theme.primary : theme.text)

            // Block dots (max 3)
            HStack(spacing: 3) {
                ForEach(Array(blocks.prefix(3).enumerated()), id: \.offset) { _, block in
                    Circle()
                        .fill(Color(hex: block.color))
                        .frame(width: 6, height: 6)
                }
            }
            .frame(height: 6)

            // Ticket count badge
            if ticketCount > 0 {
                Text("\(ticketCount)")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 14, height: 14)
                    .background(theme.accent, in: Circle())
            }
        }
        .frame(maxWidth: .infinity)
        .frame(height: 56)
        .background {
            RoundedRectangle(cornerRadius: 8)
                .fill(
                    isSelected
                    ? theme.primary.opacity(0.15)
                    : isToday
                    ? theme.primary.opacity(0.06)
                    : .clear
                )
                .overlay {
                    if isToday {
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(theme.primary.opacity(0.3), lineWidth: 1)
                    }
                }
        }
    }
}
