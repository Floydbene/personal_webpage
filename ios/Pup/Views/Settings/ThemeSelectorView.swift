import SwiftUI

struct ThemeSelectorView: View {
    @Environment(ThemeManager.self) private var themeManager
    @Environment(\.appTheme) private var theme

    var body: some View {
        List {
            ForEach(AppTheme.allThemes) { t in
                Button {
                    themeManager.selectTheme(t)
                } label: {
                    HStack(spacing: 12) {
                        // Color swatches
                        HStack(spacing: 4) {
                            Circle().fill(t.background).frame(width: 20, height: 20)
                            Circle().fill(t.primary).frame(width: 20, height: 20)
                            Circle().fill(t.accent).frame(width: 20, height: 20)
                        }

                        Text(t.name)
                            .foregroundStyle(theme.text)

                        Spacer()

                        if themeManager.currentTheme.id == t.id {
                            Image(systemName: "checkmark")
                                .foregroundStyle(theme.primary)
                                .fontWeight(.semibold)
                        }
                    }
                    .padding(.vertical, 4)
                }
                .listRowBackground(theme.cardBackground)
            }
        }
        .scrollContentBackground(.hidden)
        .background(theme.background)
        .navigationTitle("Theme")
        .toolbarBackground(theme.cardBackground, for: .navigationBar)
        .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
    }
}
