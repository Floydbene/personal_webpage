import SwiftUI

struct CreateTicketView: View {
    @Environment(\.appTheme) private var theme
    @State private var title = ""
    let onCreate: (String) async -> Void

    var body: some View {
        HStack(spacing: 8) {
            TextField("Add a ticket...", text: $title)
                .foregroundStyle(theme.text)
                .padding(10)
                .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 8))
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(theme.border, lineWidth: 1))
                .onSubmit { submit() }

            Button {
                submit()
            } label: {
                Text("Add")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(theme.primary, in: RoundedRectangle(cornerRadius: 8))
            }
            .disabled(title.trimmingCharacters(in: .whitespaces).isEmpty)
            .opacity(title.trimmingCharacters(in: .whitespaces).isEmpty ? 0.5 : 1)
        }
    }

    private func submit() {
        let trimmed = title.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        Task {
            await onCreate(trimmed)
            title = ""
        }
    }
}
