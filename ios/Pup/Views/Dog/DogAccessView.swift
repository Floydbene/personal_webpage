import SwiftUI

struct DogAccessView: View {
    @Environment(DogAccessViewModel.self) private var vm
    @Environment(\.appTheme) private var theme

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Spacer()

                if vm.isLoading && vm.access == nil {
                    VStack(spacing: 12) {
                        ProgressView()
                            .tint(theme.primary)
                        Text("Checking pup access...")
                            .font(.subheadline)
                            .foregroundStyle(theme.textMuted)
                    }
                } else if let access = vm.access, !access.hasAccess {
                    // No access - show countdown
                    VStack(spacing: 16) {
                        Image(systemName: "pawprint")
                            .font(.system(size: 48))
                            .foregroundStyle(theme.textMuted)

                        Text("Not your turn!")
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundStyle(theme.text)

                        if let holder = access.currentHolder {
                            Text("The pup is currently with **\(holder.components(separatedBy: "@").first ?? holder)**")
                                .font(.subheadline)
                                .foregroundStyle(theme.textMuted)
                        }

                        Text("Next rotation in \(vm.minutesLeft) minute\(vm.minutesLeft != 1 ? "s" : "")")
                            .font(.caption)
                            .foregroundStyle(theme.textMuted.opacity(0.7))
                            .padding(.top, 8)
                    }
                } else {
                    // Has access - show animated paw + name
                    VStack(spacing: 24) {
                        PawAnimation()
                            .frame(width: 120, height: 120)

                        Text(vm.dogName)
                            .font(.system(size: 32, weight: .light))
                            .tracking(3)
                            .foregroundStyle(theme.text)
                            .floating()

                        Text("your pup of the moment")
                            .font(.caption)
                            .foregroundStyle(theme.textMuted)
                            .tracking(1)
                    }
                }

                Spacer()
            }
            .frame(maxWidth: .infinity)
            .background(theme.background)
            .navigationTitle("Pup")
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .task {
                await vm.loadAccess()
                vm.startTimers()
            }
            .onDisappear {
                vm.stopTimers()
            }
        }
    }
}

// MARK: - Paw Animation

private struct PawAnimation: View {
    @Environment(\.appTheme) private var theme
    @State private var scale: CGFloat = 0.9
    @State private var rotation: Double = -5

    var body: some View {
        Image(systemName: "pawprint.fill")
            .font(.system(size: 64))
            .foregroundStyle(theme.accent)
            .scaleEffect(scale)
            .rotationEffect(.degrees(rotation))
            .onAppear {
                withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                    scale = 1.1
                    rotation = 5
                }
            }
    }
}

// MARK: - Floating Modifier

private struct FloatingModifier: ViewModifier {
    @State private var offset: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .offset(y: offset)
            .onAppear {
                withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                    offset = -5
                }
            }
    }
}

extension View {
    fileprivate func floating() -> some View {
        modifier(FloatingModifier())
    }
}
