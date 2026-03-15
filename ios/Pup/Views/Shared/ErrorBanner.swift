import SwiftUI

struct ErrorBanner: View {
    let message: String
    var onDismiss: (() -> Void)?

    var body: some View {
        HStack {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(Color(hex: "#f59e0b"))
            Text(message)
                .font(.caption)
                .foregroundStyle(.white)
            Spacer()
            if let onDismiss {
                Button { onDismiss() } label: {
                    Image(systemName: "xmark")
                        .font(.caption2)
                        .foregroundStyle(.white.opacity(0.7))
                }
            }
        }
        .padding(12)
        .background(Color(hex: "#ef4444").opacity(0.9), in: RoundedRectangle(cornerRadius: 8))
        .padding(.horizontal)
    }
}
