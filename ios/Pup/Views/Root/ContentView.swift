import SwiftUI

struct ContentView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(\.appTheme) private var theme

    var body: some View {
        Group {
            if auth.isLoading {
                LoadingView()
            } else if auth.isSignedIn {
                MainTabView()
            } else {
                LoginView()
            }
        }
        .task {
            await auth.bootstrap()
        }
    }
}
