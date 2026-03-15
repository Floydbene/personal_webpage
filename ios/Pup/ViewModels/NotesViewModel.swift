import Foundation
import Supabase

@Observable
final class NotesViewModel {
    var notes: [Note] = []
    var isLoading = false
    var error: String?

    private let auth: AuthManager

    init(auth: AuthManager) {
        self.auth = auth
    }

    func displayName(for email: String?, users: [UserListItem]) -> String {
        guard let email else { return "unknown" }
        if let user = users.first(where: { $0.email == email }), let name = user.displayName {
            return name
        }
        return email.components(separatedBy: "@").first ?? email
    }

    @MainActor
    func loadNotes() async {
        isLoading = true
        error = nil
        do {
            notes = try await auth.client.from("notes")
                .select()
                .order("created_at")
                .execute()
                .value
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    @MainActor
    func createNote(content: String) async {
        guard let userId = auth.userId, let email = auth.userEmail else { return }
        let payload = CreateNotePayload(
            userId: userId,
            content: content,
            createdBy: email
        )
        do {
            try await auth.client.from("notes")
                .insert(payload)
                .execute()
            await loadNotes()
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func deleteNote(id: String) async {
        do {
            try await auth.client.from("notes")
                .delete()
                .eq("id", value: id)
                .execute()
            notes.removeAll { $0.id == id }
        } catch {
            self.error = error.localizedDescription
        }
    }
}
