import SwiftUI

// MARK: - Premium Card Modifier

struct PremiumCardModifier: ViewModifier {
    @Environment(\.appTheme) private var theme

    func body(content: Content) -> some View {
        content
            .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(theme.border.opacity(0.5), lineWidth: 0.5)
            )
            .shadow(color: theme.cardShadow, radius: 8, x: 0, y: 4)
    }
}

// MARK: - Glass Card Modifier

struct GlassCardModifier: ViewModifier {
    @Environment(\.appTheme) private var theme

    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(
                        LinearGradient(
                            colors: [theme.primary.opacity(0.3), theme.accent.opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            )
    }
}

// MARK: - Themed Text Field Modifier

struct ThemedTextFieldModifier: ViewModifier {
    let isFocused: Bool
    @Environment(\.appTheme) private var theme

    func body(content: Content) -> some View {
        content
            .padding(14)
            .background(theme.cardBackground, in: RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isFocused ? theme.primary : theme.border, lineWidth: isFocused ? 1.5 : 1)
            )
            .animation(.easeInOut(duration: 0.2), value: isFocused)
    }
}

// MARK: - Extensions

extension View {
    func premiumCard() -> some View {
        modifier(PremiumCardModifier())
    }

    func glassCard() -> some View {
        modifier(GlassCardModifier())
    }

    func themedTextField(isFocused: Bool) -> some View {
        modifier(ThemedTextFieldModifier(isFocused: isFocused))
    }
}
