import SwiftUI

struct NotesListView: View {
    @Environment(NotesViewModel.self) private var vm
    @Environment(TicketsViewModel.self) private var ticketsVM
    @Environment(AuthManager.self) private var auth
    @Environment(\.appTheme) private var theme
    @State private var content = ""

    var body: some View {
        NavigationStack {
            Group {
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
                                    isOwnNote: note.createdBy == auth.userEmail,
                                    onDelete: {
                                        await vm.deleteNote(id: note.id)
                                    }
                                )
                            }
                        }
                        .padding(.horizontal)
                        .padding(.top, 8)
                        .padding(.bottom, 90)
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
            .safeAreaInset(edge: .bottom) {
                HStack(spacing: 10) {
                    TextField("Add a note...", text: $content, axis: .vertical)
                        .lineLimit(1...3)
                        .foregroundStyle(theme.text)
                        .padding(12)
                        .background(theme.cardBackground, in: Capsule())
                        .overlay(Capsule().stroke(theme.border, lineWidth: 1))

                    if !content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        Button { send() } label: {
                            Image(systemName: "arrow.up")
                                .font(.body.weight(.semibold))
                                .foregroundStyle(.white)
                                .frame(width: 36, height: 36)
                                .background(theme.primaryGradient, in: Circle())
                        }
                        .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.horizontal)
                .padding(.vertical, 10)
                .background(.ultraThinMaterial)
                .animation(.spring(response: 0.3), value: content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
    }

    private func send() {
        let trimmed = content.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        Task {
            await vm.createNote(content: trimmed)
            content = ""
        }
    }
}
