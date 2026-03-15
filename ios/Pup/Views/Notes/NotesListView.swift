import SwiftUI

struct NotesListView: View {
    @Environment(NotesViewModel.self) private var vm
    @Environment(TicketsViewModel.self) private var ticketsVM
    @Environment(\.appTheme) private var theme
    @State private var content = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Add note form
                HStack(spacing: 8) {
                    TextField("Add a note...", text: $content, axis: .vertical)
                        .lineLimit(1...3)
                        .foregroundStyle(theme.text)
                        .padding(10)
                        .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(theme.border, lineWidth: 1))

                    Button {
                        let trimmed = content.trimmingCharacters(in: .whitespacesAndNewlines)
                        guard !trimmed.isEmpty else { return }
                        Task {
                            await vm.createNote(content: trimmed)
                            content = ""
                        }
                    } label: {
                        Text("Add")
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(theme.primary, in: RoundedRectangle(cornerRadius: 8))
                    }
                    .disabled(content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    .opacity(content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? 0.5 : 1)
                }
                .padding(.horizontal)
                .padding(.top, 12)

                if let error = vm.error {
                    ErrorBanner(message: error) { vm.error = nil }
                        .padding(.top, 8)
                }

                if vm.isLoading && vm.notes.isEmpty {
                    Spacer()
                    ProgressView()
                        .tint(theme.primary)
                    Spacer()
                } else if vm.notes.isEmpty {
                    Spacer()
                    Text("No notes yet.")
                        .font(.subheadline)
                        .foregroundStyle(theme.textMuted)
                    Spacer()
                } else {
                    ScrollView {
                        LazyVStack(spacing: 6) {
                            ForEach(vm.notes) { note in
                                NoteRowView(
                                    note: note,
                                    displayName: vm.displayName(
                                        for: note.createdBy,
                                        users: ticketsVM.users
                                    ),
                                    onDelete: {
                                        await vm.deleteNote(id: note.id)
                                    }
                                )
                            }
                        }
                        .padding(.horizontal)
                        .padding(.top, 8)
                        .padding(.bottom, 20)
                    }
                    .refreshable {
                        await vm.loadNotes()
                    }
                }
            }
            .background(theme.background)
            .navigationTitle("Notes")
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .task {
                await vm.loadNotes()
            }
        }
    }
}
