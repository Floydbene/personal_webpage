import SwiftUI

struct SettingsView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(NotificationManager.self) private var notificationManager
    @Environment(ProfileViewModel.self) private var profileVM
    @Environment(ThemeManager.self) private var themeManager
    @Environment(\.appTheme) private var theme
    @State private var isEditingName = false
    @State private var nameInput = ""

    private var displayName: String {
        profileVM.profile?.displayName ?? auth.userEmail?.components(separatedBy: "@").first ?? "User"
    }

    private var initials: String {
        let name = displayName
        let parts = name.split(separator: " ")
        if parts.count >= 2 {
            return String(parts[0].prefix(1) + parts[1].prefix(1)).uppercased()
        }
        return String(name.prefix(2)).uppercased()
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Avatar + profile
                    profileSection

                    // Appearance
                    appearanceSection

                    // Notifications
                    if pushNotificationsAvailable {
                        notificationsSection
                    }

                    // Sign Out
                    signOutSection
                }
                .padding()
                .padding(.bottom, 90)
            }
            .background(theme.background)
            .navigationTitle("Settings")
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.isDark ? .dark : .light, for: .navigationBar)
            .task {
                await profileVM.loadProfile()
            }
        }
    }

    // MARK: - Profile Section

    private var profileSection: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(theme.primaryGradient)
                    .frame(width: 80, height: 80)
                Text(initials)
                    .font(.title)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
            }

            if isEditingName {
                HStack(spacing: 10) {
                    TextField("Display name", text: $nameInput)
                        .foregroundStyle(theme.text)
                        .themedTextField(isFocused: true)

                    Button("Save") {
                        Task {
                            await profileVM.updateDisplayName(nameInput)
                            isEditingName = false
                        }
                    }
                    .fontWeight(.semibold)
                    .foregroundStyle(theme.primary)
                }
                .padding(.horizontal, 20)
            } else {
                Button {
                    nameInput = profileVM.profile?.displayName ?? ""
                    isEditingName = true
                } label: {
                    VStack(spacing: 2) {
                        Text(displayName)
                            .font(.title3)
                            .fontWeight(.semibold)
                            .foregroundStyle(theme.text)
                        Text(auth.userEmail ?? "")
                            .font(.caption)
                            .foregroundStyle(theme.textMuted)
                    }
                }
            }
        }
        .padding(.top, 20)
    }

    // MARK: - Appearance Section

    private var appearanceSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("APPEARANCE")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(theme.textMuted)
                .padding(.horizontal, 4)

            NavigationLink {
                ThemeSelectorView()
            } label: {
                HStack {
                    Image(systemName: "paintpalette.fill")
                        .foregroundStyle(theme.accent)
                    Text("Theme")
                        .foregroundStyle(theme.text)
                    Spacer()
                    Text(themeManager.currentTheme.name)
                        .font(.caption)
                        .foregroundStyle(theme.textMuted)
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(theme.textMuted)
                }
                .padding(14)
            }
            .premiumCard()
        }
    }

    // MARK: - Notifications Section

    private var notificationsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("NOTIFICATIONS")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(theme.textMuted)
                .padding(.horizontal, 4)

            HStack {
                Image(systemName: "bell.fill")
                    .foregroundStyle(theme.accent)
                @Bindable var nm = notificationManager
                Toggle("Push Notifications", isOn: $nm.pushEnabled)
                    .foregroundStyle(theme.text)
                    .tint(theme.primary)
            }
            .padding(14)
            .premiumCard()
        }
    }

    // MARK: - Sign Out Section

    private var signOutSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Button(role: .destructive) {
                Task { await auth.signOut() }
            } label: {
                HStack {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                    Text("Sign Out")
                    Spacer()
                }
                .foregroundStyle(Color(hex: "#ef4444"))
                .padding(14)
            }
            .premiumCard()
        }
    }
}
