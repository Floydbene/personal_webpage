import SwiftUI

struct TimeAgoText: View {
    let date: Date
    @Environment(\.appTheme) private var theme

    var body: some View {
        Text(date.timeAgo)
            .font(.caption2)
            .foregroundStyle(theme.textMuted)
    }
}
