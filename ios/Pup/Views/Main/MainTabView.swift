import SwiftUI

struct MainTabView: View {
    @Environment(\.appTheme) private var theme

    var body: some View {
        TabView {
            TicketsListView()
                .tabItem {
                    Label("Tickets", systemImage: "ticket")
                }

            NotesListView()
                .tabItem {
                    Label("Notes", systemImage: "note.text")
                }

            DogAccessView()
                .tabItem {
                    Label("Pup", systemImage: "pawprint")
                }

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape")
                }
        }
        .tint(theme.primary)
    }
}
