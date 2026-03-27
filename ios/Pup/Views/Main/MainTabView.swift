import SwiftUI

enum Tab: String, CaseIterable {
    case tickets, notes, pup, settings

    var icon: String {
        switch self {
        case .tickets: "ticket"
        case .notes: "note.text"
        case .pup: "pawprint"
        case .settings: "gearshape"
        }
    }

    var filledIcon: String {
        switch self {
        case .tickets: "ticket"
        case .notes: "note.text"
        case .pup: "pawprint.fill"
        case .settings: "gearshape.fill"
        }
    }

    var label: String {
        switch self {
        case .tickets: "Tickets"
        case .notes: "Notes"
        case .pup: "Pup"
        case .settings: "Settings"
        }
    }
}

struct MainTabView: View {
    @Environment(\.appTheme) private var theme
    @State private var selectedTab: Tab = .tickets
    @Namespace private var tabNamespace

    var body: some View {
        ZStack(alignment: .bottom) {
            // Content
            Group {
                switch selectedTab {
                case .tickets: TicketsListView()
                case .notes: NotesListView()
                case .pup: DogAccessView()
                case .settings: SettingsView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            // Floating tab bar
            floatingTabBar
        }
        .sensoryFeedback(.selection, trigger: selectedTab)
    }

    private var floatingTabBar: some View {
        HStack(spacing: 0) {
            ForEach(Tab.allCases, id: \.self) { tab in
                tabButton(for: tab)
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 10)
        .background {
            Capsule()
                .fill(.ultraThinMaterial)
                .shadow(color: theme.cardShadow, radius: 12, y: 4)
        }
        .padding(.horizontal, 40)
        .padding(.bottom, 8)
    }

    private func tabButton(for tab: Tab) -> some View {
        let isSelected = selectedTab == tab

        return Button {
            withAnimation(.spring(response: 0.35, dampingFraction: 0.75)) {
                selectedTab = tab
            }
        } label: {
            VStack(spacing: 4) {
                ZStack {
                    if isSelected {
                        Capsule()
                            .fill(theme.primary.opacity(0.2))
                            .frame(width: 48, height: 28)
                            .matchedGeometryEffect(id: "tabIndicator", in: tabNamespace)
                    }

                    Image(systemName: isSelected ? tab.filledIcon : tab.icon)
                        .font(.system(size: 16, weight: isSelected ? .semibold : .regular))
                        .symbolEffect(.bounce, value: isSelected)
                }
                .frame(height: 28)

                Text(tab.label)
                    .font(.system(size: 10, weight: isSelected ? .semibold : .regular))
            }
            .foregroundStyle(isSelected ? theme.primary : theme.textMuted)
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.plain)
    }
}
