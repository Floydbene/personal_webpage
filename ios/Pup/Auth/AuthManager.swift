import Foundation
import Supabase

@Observable
final class AuthManager {
    private(set) var isSignedIn = false
    private(set) var isLoading = true
    private(set) var userEmail: String?
    private(set) var userId: String?
    private(set) var error: String?

    let client: SupabaseClient

    init() {
        self.client = SupabaseClient(
            supabaseURL: URL(string: Config.supabaseURL)!,
            supabaseKey: Config.supabaseAnonKey
        )
    }

    @MainActor
    func bootstrap() async {
        isLoading = true
        do {
            let session = try await client.auth.session
            isSignedIn = true
            userEmail = session.user.email
            userId = session.user.id.uuidString
        } catch {
            isSignedIn = false
        }
        isLoading = false
    }

    var accessToken: String? {
        get async {
            try? await client.auth.session.accessToken
        }
    }

    @MainActor
    func signIn(email: String, password: String) async {
        error = nil
        do {
            let session = try await client.auth.signIn(email: email, password: password)
            isSignedIn = true
            userEmail = session.user.email
            userId = session.user.id.uuidString
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func signOut() async {
        try? await client.auth.signOut()
        isSignedIn = false
        userEmail = nil
        userId = nil
    }
}
