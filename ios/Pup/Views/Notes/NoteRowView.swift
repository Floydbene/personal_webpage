import SwiftUI

struct NoteRowView: View {
    let note: Note
    let displayName: String
    let onDelete: () async -> Void
    @Environment(\.appTheme) private var theme
    @State private var confirmDelete = false

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(note.content)
                    .font(.subheadline)
                    .foregroundStyle(theme.text)

                HStack(spacing: 4) {
                    Text(displayName)
                    Text("—")
                    Text(note.createdAt, style: .date)
                }
                .font(.caption2)
                .foregroundStyle(theme.textMuted)
            }

            Spacer()

            ConfirmDeleteButton {
                Task { await onDelete() }
            }
        }
        .padding(12)
        .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 10))
    }
}
