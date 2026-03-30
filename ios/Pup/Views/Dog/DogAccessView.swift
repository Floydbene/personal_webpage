import SwiftUI

struct DogAccessView: View {
    @Environment(DogAccessViewModel.self) private var vm
    @Environment(\.appTheme) private var theme

    var body: some View {
        NavigationStack {
            ZStack {
                theme.background.ignoresSafeArea()

                VStack(spacing: 0) {
                    Spacer()

                    if vm.isLoading && vm.access == nil {
                        loadingContent
                    } else if let access = vm.access, !access.hasAccess {
                        noAccessContent(access: access)
                    } else {
                        hasAccessContent
                    }

                    Spacer()
                }
            }
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

    // MARK: - Loading

    private var loadingContent: some View {
        VStack(spacing: 12) {
            ProgressView()
                .tint(theme.primary)
            Text("Checking pup access...")
                .font(.subheadline)
                .foregroundStyle(theme.textMuted)
        }
    }

    // MARK: - No Access (Countdown)

    private func noAccessContent(access: DogAccessResponse) -> some View {
        let progress = max(0, 1.0 - Double(vm.minutesLeft) / 30.0)

        return VStack(spacing: 20) {
            Text("Not your turn!")
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundStyle(theme.text)
                .tracking(0.5)

            // Circular countdown ring
            ZStack {
                Circle()
                    .stroke(theme.border.opacity(0.3), lineWidth: 6)
                    .frame(width: 160, height: 160)

                Circle()
                    .trim(from: 0, to: CGFloat(progress))
                    .stroke(
                        theme.primary,
                        style: StrokeStyle(lineWidth: 6, lineCap: .round)
                    )
                    .frame(width: 160, height: 160)
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 0.8), value: progress)

                VStack(spacing: 4) {
                    Text("\(vm.minutesLeft)")
                        .font(.system(size: 48, weight: .light, design: .rounded))
                        .foregroundStyle(theme.text)
                        .contentTransition(.numericText())

                    Text(vm.minutesLeft == 1 ? "minute" : "minutes")
                        .font(.caption)
                        .foregroundStyle(theme.textMuted)
                        .textCase(.uppercase)
                        .tracking(1)
                }
            }
            .padding(.vertical, 8)

            if let holder = access.currentHolder {
                let name = holder.components(separatedBy: "@").first ?? holder
                HStack(spacing: 6) {
                    Image(systemName: "person.fill")
                        .font(.caption2)
                        .foregroundStyle(theme.accent)
                    Text(name)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundStyle(theme.textSecondary)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    Capsule()
                        .fill(theme.cardBackground)
                        .overlay(
                            Capsule()
                                .strokeBorder(theme.border.opacity(0.5), lineWidth: 1)
                        )
                )
            }

            Text("hang tight")
                .font(.caption2)
                .foregroundStyle(theme.textMuted.opacity(0.6))
                .tracking(2)
                .textCase(.uppercase)
        }
    }

    // MARK: - Has Access (Rings + Particles)

    private var hasAccessContent: some View {
        ZStack {
            AnimatedRadialBackground()

            VStack(spacing: 24) {
                ZStack {
                    PulsingRings()
                    PawAnimation()
                        .frame(width: 120, height: 120)
                    ParticleField()
                        .frame(width: 280, height: 280)
                        .allowsHitTesting(false)
                }
                .frame(width: 280, height: 280)

                Text(vm.dogName)
                    .font(.system(size: 36, weight: .light, design: .rounded))
                    .tracking(4)
                    .foregroundStyle(theme.accent)
                    .floating()

                Text("your pup of the moment")
                    .font(.caption)
                    .foregroundStyle(theme.textMuted)
                    .tracking(1)
            }
        }
    }
}

// MARK: - Pulsing Rings

private struct PulsingRings: View {
    @Environment(\.appTheme) private var theme
    @State private var ringScale: [CGFloat] = [1, 1, 1]
    @State private var ringOpacity: [Double] = [0.3, 0.3, 0.3]

    var body: some View {
        ZStack {
            ForEach(0..<3, id: \.self) { i in
                Circle()
                    .stroke(theme.accent.opacity(0.3), lineWidth: 2)
                    .frame(width: 120, height: 120)
                    .scaleEffect(ringScale[i])
                    .opacity(ringOpacity[i])
                    .onAppear {
                        withAnimation(
                            .easeOut(duration: 2)
                            .repeatForever(autoreverses: false)
                            .delay(Double(i) * 0.6)
                        ) {
                            ringScale[i] = 2.0
                            ringOpacity[i] = 0
                        }
                    }
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

// MARK: - Particle Field

private struct Particle: Identifiable {
    let id = UUID()
    let baseX: CGFloat
    let baseY: CGFloat
    let speed: Double
    let phase: Double
    let size: CGFloat
}

private struct ParticleField: View {
    @Environment(\.appTheme) private var theme

    private let particles: [Particle] = (0..<10).map { _ in
        Particle(
            baseX: CGFloat.random(in: 0...280),
            baseY: CGFloat.random(in: 0...280),
            speed: Double.random(in: 0.3...0.8),
            phase: Double.random(in: 0...(2 * .pi)),
            size: CGFloat.random(in: 8...14)
        )
    }

    var body: some View {
        TimelineView(.animation) { timeline in
            canvas(time: timeline.date.timeIntervalSinceReferenceDate)
        }
    }

    private func canvas(time: Double) -> some View {
        let accentColor = theme.accent
        return Canvas { context, size in
            let symbol = context.resolve(Image(systemName: "pawprint.fill"))
            for particle in particles {
                let x = particle.baseX + sin(time * particle.speed + particle.phase) * 30
                let rawY = particle.baseY - (time * 15).truncatingRemainder(dividingBy: Double(size.height))
                let y = rawY < 0 ? rawY + size.height : rawY
                let distFromCenter = hypot(x - size.width / 2, y - size.height / 2)
                let maxDist = size.width / 2
                let opacity = max(0, 1 - distFromCenter / maxDist) * 0.4

                var particleContext = context
                particleContext.opacity = opacity
                particleContext.drawLayer { inner in
                    inner.draw(symbol, at: CGPoint(x: x, y: y))
                }
            }
        }
        .foregroundStyle(accentColor)
    }
}

// MARK: - Animated Radial Background

private struct AnimatedRadialBackground: View {
    @Environment(\.appTheme) private var theme
    @State private var rotation: Double = 0

    var body: some View {
        RadialGradient(
            colors: [theme.primary.opacity(0.08), theme.accent.opacity(0.04), .clear],
            center: .center,
            startRadius: 20,
            endRadius: 300
        )
        .rotationEffect(.degrees(rotation))
        .onAppear {
            withAnimation(.linear(duration: 20).repeatForever(autoreverses: false)) {
                rotation = 360
            }
        }
        .ignoresSafeArea()
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
