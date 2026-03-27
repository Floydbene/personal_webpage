import SwiftUI

struct ErrorBanner: View {
    let message: String
    var onDismiss: (() -> Void)?

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(Color(hex: "#f59e0b"))
            Text(message)
                .font(.caption)
                .foregroundStyle(.white)
            Spacer()
            if let onDismiss {
                Button { onDismiss() } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.7))
                }
            }
        }
        .padding(14)
        .background(Color(hex: "#ef4444").opacity(0.9), in: RoundedRectangle(cornerRadius: 12))
        .shadow(color: Color(hex: "#ef4444").opacity(0.3), radius: 8, y: 4)
        .padding(.horizontal)
        .transition(.move(edge: .top).combined(with: .opacity))
    }
}
