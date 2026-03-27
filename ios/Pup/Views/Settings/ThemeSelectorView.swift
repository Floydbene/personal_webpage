import SwiftUI

struct ThemeSelectorView: View {
    @Environment(ThemeManager.self) private var themeManager
    @Environment(\.appTheme) private var theme

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(AppTheme.allThemes) { t in
                    Button {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            themeManager.selectTheme(t)
                        }
                    } label: {
                        themeCard(for: t)
                    }
                }
            }
            .padding()
        }
        .background(theme.background)
        .navigationTitle("Theme")
        .toolbarBackground(theme.cardBackground, for: .navigationBar)
        .toolbarColorScheme(theme.isDark ? .dark : .light, for: .navigationBar)
    }

    private func themeCard(for t: AppTheme) -> some View {
        let isSelected = themeManager.currentTheme.id == t.id

        return VStack(spacing: 8) {
            // Mini preview card showing actual theme colors
            RoundedRectangle(cornerRadius: 8)
                .fill(t.background)
                .frame(height: 80)
                .overlay {
                    VStack(spacing: 6) {
                        RoundedRectangle(cornerRadius: 3)
                            .fill(t.text.opacity(0.6))
                            .frame(height: 8)
                            .frame(maxWidth: .infinity)
                        HStack(spacing: 4) {
                            Circle().fill(t.primary).frame(width: 12, height: 12)
                            RoundedRectangle(cornerRadius: 2)
                                .fill(t.textMuted)
                                .frame(height: 6)
                            Spacer()
                        }
                        HStack(spacing: 4) {
                            RoundedRectangle(cornerRadius: 2)
                                .fill(t.accent)
                                .frame(width: 30, height: 6)
                            Spacer()
                        }
                    }
                    .padding(10)
                }
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(t.border, lineWidth: 1)
                )

            // Theme name + color dots
            VStack(spacing: 4) {
                Text(t.name)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundStyle(theme.text)

                HStack(spacing: 3) {
                    Circle().fill(t.primary).frame(width: 8, height: 8)
                    Circle().fill(t.accent).frame(width: 8, height: 8)
                    Circle().fill(t.background).frame(width: 8, height: 8)
                        .overlay(Circle().stroke(theme.border, lineWidth: 0.5))
                }
            }
        }
        .padding(10)
        .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(
                    isSelected ? theme.primary : theme.border.opacity(0.3),
                    lineWidth: isSelected ? 2 : 0.5
                )
        )
    }
}
