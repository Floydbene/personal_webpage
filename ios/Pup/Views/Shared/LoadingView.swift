import SwiftUI

struct LoadingView: View {
    @Environment(\.appTheme) private var theme

    var body: some View {
        VStack {
            ProgressView()
                .tint(theme.primary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(theme.background)
    }
}
