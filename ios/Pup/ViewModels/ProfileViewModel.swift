import Foundation
import Supabase

@Observable
final class ProfileViewModel {
    var profile: UserProfile?
    var isLoading = false
    var error: String?

    private let auth: AuthManager

    init(auth: AuthManager) {
        self.auth = auth
    }

    @MainActor
    func loadProfile() async {
        guard let userId = auth.userId else { return }
        isLoading = true
        do {
            let profiles: [UserProfile] = try await auth.client.from("profiles")
                .select()
                .eq("user_id", value: userId)
                .execute()
                .value
            if let existing = profiles.first {
                profile = existing
            } else {
                // No profile row yet — show defaults
                profile = UserProfile(
                    userId: userId,
                    email: auth.userEmail ?? "",
                    displayName: ""
                )
            }
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    @MainActor
    func updateDisplayName(_ name: String) async {
        guard let userId = auth.userId, let email = auth.userEmail else { return }
        let payload = UpsertProfilePayload(
            userId: userId,
            email: email,
            displayName: name.trimmingCharacters(in: .whitespaces)
        )
        do {
            let result: UserProfile = try await auth.client.from("profiles")
                .upsert(payload)
                .select()
                .single()
                .execute()
                .value
            profile = result
        } catch {
            self.error = error.localizedDescription
        }
    }
}
