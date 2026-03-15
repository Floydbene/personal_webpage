import SwiftUI

@main
struct PupApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    @State private var authManager = AuthManager()
    @State private var themeManager = ThemeManager()
    @State private var notificationManager = NotificationManager()
    @State private var ticketsVM: TicketsViewModel
    @State private var notesVM: NotesViewModel
    @State private var profileVM: ProfileViewModel
    @State private var dogAccessVM: DogAccessViewModel

    init() {
        let auth = AuthManager()
        _authManager = State(initialValue: auth)
        _ticketsVM = State(initialValue: TicketsViewModel(auth: auth))
        _notesVM = State(initialValue: NotesViewModel(auth: auth))
        _profileVM = State(initialValue: ProfileViewModel(auth: auth))
        _dogAccessVM = State(initialValue: DogAccessViewModel(auth: auth))
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(authManager)
                .environment(themeManager)
                .environment(notificationManager)
                .environment(ticketsVM)
                .environment(notesVM)
                .environment(profileVM)
                .environment(dogAccessVM)
                .appTheme(themeManager.currentTheme)
                .preferredColorScheme(themeManager.currentTheme.id == "light" ? .light : .dark)
                .onAppear {
                    notificationManager.configure(auth: authManager)
                    appDelegate.notificationManager = notificationManager
                }
                .onChange(of: authManager.isSignedIn) { _, isSignedIn in
                    if isSignedIn {
                        Task { await notificationManager.requestPermission() }
                    } else {
                        Task { await notificationManager.removeToken() }
                    }
                }
        }
    }
}
