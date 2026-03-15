import SwiftUI

struct AppTheme: Identifiable, Equatable {
    let id: String
    let name: String
    let background: Color
    let backgroundSecondary: Color
    let text: Color
    let textSecondary: Color
    let textMuted: Color
    let primary: Color
    let accent: Color
    let border: Color
    let cardBackground: Color

    static let allThemes: [AppTheme] = [
        .darkPlus, .cursorDark, .midnightBlue, .solarizedDark,
        .nordDark, .dracula, .light
    ]

    // MARK: - Dark+
    static let darkPlus = AppTheme(
        id: "darkPlus",
        name: "Dark+",
        background: Color(hex: "#1e1e1e"),
        backgroundSecondary: Color(hex: "#252526"),
        text: Color(hex: "#d4d4d4"),
        textSecondary: Color(hex: "#cccccc"),
        textMuted: Color(hex: "#858585"),
        primary: Color(hex: "#569cd6"),
        accent: Color(hex: "#4ec9b0"),
        border: Color(hex: "#3e3e42"),
        cardBackground: Color(hex: "#252526")
    )

    // MARK: - Cursor Dark
    static let cursorDark = AppTheme(
        id: "cursorDark",
        name: "Cursor Dark",
        background: Color(hex: "#0a0a0a"),
        backgroundSecondary: Color(hex: "#1a1a2e"),
        text: Color(hex: "#ffffff"),
        textSecondary: Color(hex: "#e0e0e0"),
        textMuted: Color(hex: "#a0a0a0"),
        primary: Color(hex: "#5e81ac"),
        accent: Color(hex: "#88c0d0"),
        border: Color(hex: "#3a3a4a"),
        cardBackground: Color(hex: "#16213e")
    )

    // MARK: - Midnight Blue
    static let midnightBlue = AppTheme(
        id: "midnightBlue",
        name: "Midnight Blue",
        background: Color(hex: "#0c1821"),
        backgroundSecondary: Color(hex: "#1b2a41"),
        text: Color(hex: "#f0f4f8"),
        textSecondary: Color(hex: "#d9e2ec"),
        textMuted: Color(hex: "#9fb3c8"),
        primary: Color(hex: "#3d5a80"),
        accent: Color(hex: "#98c1d9"),
        border: Color(hex: "#2e4057"),
        cardBackground: Color(hex: "#1b2a41")
    )

    // MARK: - Solarized Dark
    static let solarizedDark = AppTheme(
        id: "solarizedDark",
        name: "Solarized Dark",
        background: Color(hex: "#002b36"),
        backgroundSecondary: Color(hex: "#073642"),
        text: Color(hex: "#fdf6e3"),
        textSecondary: Color(hex: "#eee8d5"),
        textMuted: Color(hex: "#93a1a1"),
        primary: Color(hex: "#268bd2"),
        accent: Color(hex: "#2aa198"),
        border: Color(hex: "#586e75"),
        cardBackground: Color(hex: "#073642")
    )

    // MARK: - Nord
    static let nordDark = AppTheme(
        id: "nordDark",
        name: "Nord",
        background: Color(hex: "#2e3440"),
        backgroundSecondary: Color(hex: "#3b4252"),
        text: Color(hex: "#eceff4"),
        textSecondary: Color(hex: "#e5e9f0"),
        textMuted: Color(hex: "#d8dee9"),
        primary: Color(hex: "#88c0d0"),
        accent: Color(hex: "#8fbcbb"),
        border: Color(hex: "#4c566a"),
        cardBackground: Color(hex: "#3b4252")
    )

    // MARK: - Dracula
    static let dracula = AppTheme(
        id: "dracula",
        name: "Dracula",
        background: Color(hex: "#282a36"),
        backgroundSecondary: Color(hex: "#44475a"),
        text: Color(hex: "#f8f8f2"),
        textSecondary: Color(hex: "#f1f1eb"),
        textMuted: Color(hex: "#6272a4"),
        primary: Color(hex: "#bd93f9"),
        accent: Color(hex: "#ff79c6"),
        border: Color(hex: "#44475a"),
        cardBackground: Color(hex: "#383a59")
    )

    // MARK: - Clean Light
    static let light = AppTheme(
        id: "light",
        name: "Clean Light",
        background: Color(hex: "#ffffff"),
        backgroundSecondary: Color(hex: "#f5f5f5"),
        text: Color(hex: "#1a1a1a"),
        textSecondary: Color(hex: "#333333"),
        textMuted: Color(hex: "#666666"),
        primary: Color(hex: "#0066cc"),
        accent: Color(hex: "#0080ff"),
        border: Color(hex: "#d0d0d0"),
        cardBackground: Color(hex: "#f9f9f9")
    )
}
