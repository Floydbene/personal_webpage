import SwiftUI

struct CreateShoppingItemView: View {
    @Environment(\.appTheme) private var theme
    @State private var name = ""
    @FocusState private var isFocused: Bool
    let onCreate: (String) async -> Void

    var body: some View {
        HStack(spacing: 10) {
            TextField("Add an item...", text: $name)
                .foregroundStyle(theme.text)
                .focused($isFocused)
                .themedTextField(isFocused: isFocused)
                .onSubmit { submit() }

            Button {
                submit()
            } label: {
                Image(systemName: "plus")
                    .font(.body.weight(.semibold))
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(theme.primaryGradient, in: Circle())
                    .shadow(color: theme.primary.opacity(0.3), radius: 4, y: 2)
            }
            .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
            .opacity(name.trimmingCharacters(in: .whitespaces).isEmpty ? 0.5 : 1)
        }
    }

    private func submit() {
        let trimmed = name.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        Task {
            await onCreate(trimmed)
            name = ""
        }
    }
}
