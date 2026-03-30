import SwiftUI

struct ScheduleBlockRowView: View {
    let block: ScheduleBlock
    var ticketTitle: String?
    @Environment(\.appTheme) private var theme

    private var dateRange: String {
        guard let start = block.startDateParsed, let end = block.endDateParsed else {
            return "\(block.startDate) - \(block.endDate)"
        }
        if Calendar.current.isDate(start, inSameDayAs: end) {
            return start.shortDate
        }
        return "\(start.shortDate) – \(end.shortDate)"
    }

    var body: some View {
        HStack(spacing: 14) {
            // Color bar
            RoundedRectangle(cornerRadius: 2)
                .fill(Color(hex: block.color))
                .frame(width: 4)

            VStack(alignment: .leading, spacing: 4) {
                Text(block.title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(theme.text)

                HStack(spacing: 8) {
                    Text(dateRange)
                        .font(.caption2)
                        .foregroundStyle(theme.textMuted)

                    if let ticketTitle {
                        HStack(spacing: 3) {
                            Image(systemName: "ticket")
                                .font(.system(size: 9))
                            Text(ticketTitle)
                        }
                        .font(.caption2)
                        .foregroundStyle(theme.accent)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(theme.accent.opacity(0.12), in: Capsule())
                    }
                }
            }

            Spacer()
        }
        .padding(.vertical, 10)
        .padding(.horizontal, 12)
        .premiumCard()
    }
}
