import SwiftUI

struct SettingsView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(NotificationManager.self) private var notificationManager
    @Environment(ProfileViewModel.self) private var profileVM
    @Environment(\.appTheme) private var theme
    @State private var isEditingName = false
    @State private var nameInput = ""

    var body: some View {
        NavigationStack {
            List {
                // Profile section
                Section {
                    if isEditingName {
                        HStack {
                            TextField("Display name", text: $nameInput)
                                .foregroundStyle(theme.text)
                            Button("Save") {
                                Task {
                                    await profileVM.updateDisplayName(nameInput)
                                    isEditingName = false
                                }
                            }
                            .foregroundStyle(theme.primary)
                        }
                        .listRowBackground(theme.cardBackground)
                    } else {
                        Button {
                            nameInput = profileVM.profile?.displayName ?? ""
                            isEditingName = true
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(profileVM.profile?.displayName ?? auth.userEmail?.components(separatedBy: "@").first ?? "User")
                                        .font(.headline)
                                        .foregroundStyle(theme.text)
                                    Text(auth.userEmail ?? "")
                                        .font(.caption)
                                        .foregroundStyle(theme.textMuted)
                                }
                                Spacer()
                                Image(systemName: "pencil")
                                    .foregroundStyle(theme.textMuted)
                            }
                        }
                        .listRowBackground(theme.cardBackground)
                    }
                } header: {
                    Text("Profile")
                        .foregroundStyle(theme.textMuted)
                }

                // Theme section
                Section {
                    NavigationLink {
                        ThemeSelectorView()
                    } label: {
                        HStack {
                            Image(systemName: "paintpalette")
                                .foregroundStyle(theme.accent)
                            Text("Theme")
                                .foregroundStyle(theme.text)
                        }
                    }
                    .listRowBackground(theme.cardBackground)
                } header: {
                    Text("Appearance")
                        .foregroundStyle(theme.textMuted)
                }

                // Notifications section
                Section {
                    @Bindable var nm = notificationManager
                    Toggle(isOn: $nm.pushEnabled) {
                        HStack {
                            Image(systemName: "bell")
                                .foregroundStyle(theme.accent)
                            Text("Push Notifications")
                                .foregroundStyle(theme.text)
                        }
                    }
                    .tint(theme.primary)
                    .listRowBackground(theme.cardBackground)
                } header: {
                    Text("Notifications")
                        .foregroundStyle(theme.textMuted)
                } footer: {
                    Text("When disabled, you won't receive push notifications for ticket activity.")
                        .foregroundStyle(theme.textMuted)
                }

                // Sign out section
                Section {
                    Button(role: .destructive) {
                        Task { await auth.signOut() }
                    } label: {
                        HStack {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                            Text("Sign Out")
                        }
                        .foregroundStyle(Color(hex: "#ef4444"))
                    }
                    .listRowBackground(theme.cardBackground)
                }
            }
            .scrollContentBackground(.hidden)
            .background(theme.background)
            .navigationTitle("Settings")
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .task {
                await profileVM.loadProfile()
            }
        }
    }
}
