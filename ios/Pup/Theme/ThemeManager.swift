import Foundation

@Observable
final class ThemeManager {
    var currentTheme: AppTheme {
        didSet {
            UserDefaults.standard.set(currentTheme.id, forKey: "selectedThemeId")
        }
    }

    init() {
        let savedId = UserDefaults.standard.string(forKey: "selectedThemeId") ?? "darkPlus"
        self.currentTheme = AppTheme.allThemes.first { $0.id == savedId } ?? .darkPlus
    }

    func selectTheme(_ theme: AppTheme) {
        currentTheme = theme
    }
}
