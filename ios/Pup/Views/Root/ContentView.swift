import SwiftUI

struct ContentView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(\.appTheme) private var theme

    var body: some View {
        Group {
            if auth.isLoading {
                LoadingView()
                    .transition(.opacity)
            } else if auth.isSignedIn {
                MainTabView()
                    .transition(.asymmetric(
                        insertion: .scale(scale: 0.95).combined(with: .opacity),
                        removal: .opacity
                    ))
            } else {
                LoginView()
                    .transition(.asymmetric(
                        insertion: .scale(scale: 0.95).combined(with: .opacity),
                        removal: .opacity
                    ))
            }
        }
        .animation(.easeInOut(duration: 0.5), value: auth.isLoading)
        .animation(.easeInOut(duration: 0.5), value: auth.isSignedIn)
        .task {
            await auth.bootstrap()
        }
    }
}
