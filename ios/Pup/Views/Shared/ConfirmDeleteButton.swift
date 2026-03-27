import SwiftUI

struct ConfirmDeleteButton: View {
    let action: () -> Void
    @State private var confirming = false
    @Environment(\.appTheme) private var theme

    var body: some View {
        Button {
            if confirming {
                action()
                confirming = false
            } else {
                confirming = true
            }
        } label: {
            if confirming {
                Text("Tap to confirm")
                    .font(.caption)
                    .foregroundStyle(.white)
            } else {
                Image(systemName: "trash")
                    .font(.caption)
                    .foregroundStyle(Color(hex: "#ef4444"))
            }
        }
        .padding(.horizontal, confirming ? 12 : 8)
        .padding(.vertical, 6)
        .background(confirming ? Color(hex: "#ef4444") : Color.clear, in: Capsule())
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: confirming)
        .onDisappear { confirming = false }
    }
}
