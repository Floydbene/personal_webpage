import SwiftUI

struct LoadingView: View {
    @Environment(\.appTheme) private var theme
    @State private var isAnimating = false
    @State private var textOpacity: Double = 0.4

    var body: some View {
        VStack(spacing: 16) {
            ZStack {
                // Pulsing ring
                Circle()
                    .stroke(theme.primary.opacity(0.3), lineWidth: 3)
                    .frame(width: 80, height: 80)
                    .scaleEffect(isAnimating ? 1.2 : 0.9)
                    .opacity(isAnimating ? 0 : 1)

                // Paw icon
                Image(systemName: "pawprint.fill")
                    .font(.system(size: 32))
                    .foregroundStyle(theme.accent)
                    .scaleEffect(isAnimating ? 1.05 : 0.95)
            }

            Text("Pup")
                .font(.title3)
                .fontWeight(.light)
                .foregroundStyle(theme.text)
                .tracking(3)
                .opacity(textOpacity)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(theme.background)
        .onAppear {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                isAnimating = true
                textOpacity = 1.0
            }
        }
    }
}
