import SwiftUI

struct NoteRowView: View {
    let note: Note
    let displayName: String
    let isOwnNote: Bool
    let onDelete: () async -> Void
    @Environment(\.appTheme) private var theme

    private var bubbleShape: UnevenRoundedRectangle {
        isOwnNote
            ? UnevenRoundedRectangle(topLeadingRadius: 16, bottomLeadingRadius: 16, bottomTrailingRadius: 4, topTrailingRadius: 16)
            : UnevenRoundedRectangle(topLeadingRadius: 4, bottomLeadingRadius: 16, bottomTrailingRadius: 16, topTrailingRadius: 16)
    }

    var body: some View {
        HStack {
            if isOwnNote { Spacer(minLength: 60) }

            VStack(alignment: isOwnNote ? .trailing : .leading, spacing: 4) {
                Text(note.content)
                    .font(.subheadline)
                    .foregroundStyle(theme.text)
                    .padding(12)
                    .background(
                        isOwnNote ? theme.primary.opacity(0.15) : theme.cardBackground,
                        in: bubbleShape
                    )
                    .contextMenu {
                        Button(role: .destructive) {
                            Task { await onDelete() }
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }

                HStack(spacing: 4) {
                    Text(displayName)
                    Text("·")
                    Text(note.createdAt, style: .date)
                }
                .font(.caption2)
                .foregroundStyle(theme.textMuted)
                .padding(.horizontal, 4)
            }

            if !isOwnNote { Spacer(minLength: 60) }
        }
    }
}
