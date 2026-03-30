import SwiftUI

struct MainTabView: View {
    @Environment(\.appTheme) private var theme
    @State private var selectedTab: Tab = .calendar

    private enum Tab {
        case calendar, tickets, shopping, notes, settings
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            CalendarView()
                .tabItem {
                    Label("Calendar", systemImage: "calendar")
                }
                .tag(Tab.calendar)

            TicketsListView()
                .tabItem {
                    Label("Tickets", systemImage: "ticket")
                }
                .tag(Tab.tickets)

            ShoppingListView()
                .tabItem {
                    Label("Shopping", systemImage: "cart")
                }
                .tag(Tab.shopping)

            NotesListView()
                .tabItem {
                    Label("Notes", systemImage: "note.text")
                }
                .tag(Tab.notes)

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape")
                }
                .tag(Tab.settings)
        }
        .tint(theme.primary)
        .toolbarBackground(theme.cardBackground, for: .tabBar)
        .toolbarColorScheme(theme.isDark ? .dark : .light, for: .tabBar)
        .sensoryFeedback(.selection, trigger: selectedTab)
    }
}
