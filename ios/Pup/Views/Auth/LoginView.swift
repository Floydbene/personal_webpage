import SwiftUI

struct LoginView: View {
    @Environment(AuthManager.self) private var auth
    @Environment(\.appTheme) private var theme
    @State private var email = ""
    @State private var password = ""
    @State private var isSubmitting = false
    @State private var showLogo = false
    @State private var showTitle = false
    @State private var showForm = false
    @State private var isPressed = false
    @FocusState private var focusedField: Field?

    enum Field: Hashable {
        case email, password
    }

    var body: some View {
        ZStack {
            // Animated gradient background
            animatedBackground

            // Content
            VStack(spacing: 32) {
                Spacer()

                logoSection

                formCard

                Spacer()
                Spacer()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .onAppear {
            withAnimation(.easeOut(duration: 0.6)) {
                showLogo = true
            }
            withAnimation(.easeOut(duration: 0.6).delay(0.3)) {
                showTitle = true
            }
            withAnimation(.easeOut(duration: 0.5).delay(0.5)) {
                showForm = true
            }
        }
    }

    // MARK: - Animated Background

    private var animatedBackground: some View {
        TimelineView(.animation) { timeline in
            let time = timeline.date.timeIntervalSinceReferenceDate
            Canvas { context, size in
                // First blob - primary color
                let x1 = size.width * 0.5 + cos(time * 0.4) * size.width * 0.3
                let y1 = size.height * 0.35 + sin(time * 0.3) * size.height * 0.15
                let blob1 = Path(ellipseIn: CGRect(
                    x: x1 - 120, y: y1 - 120,
                    width: 240, height: 240
                ))
                context.fill(blob1, with: .color(theme.primary.opacity(0.4)))

                // Second blob - accent color
                let x2 = size.width * 0.5 + sin(time * 0.35) * size.width * 0.25
                let y2 = size.height * 0.6 + cos(time * 0.45) * size.height * 0.2
                let blob2 = Path(ellipseIn: CGRect(
                    x: x2 - 150, y: y2 - 150,
                    width: 300, height: 300
                ))
                context.fill(blob2, with: .color(theme.accent.opacity(0.3)))
            }
            .blur(radius: 60)
        }
        .background(theme.background)
        .ignoresSafeArea()
    }

    // MARK: - Logo Section

    private var logoSection: some View {
        VStack(spacing: 8) {
            Image(systemName: "pawprint.fill")
                .font(.system(size: 48))
                .foregroundStyle(theme.accent)
                .symbolEffect(.bounce, value: showLogo)
                .opacity(showLogo ? 1 : 0)
                .scaleEffect(showLogo ? 1 : 0.5)

            Text("Pup")
                .font(.largeTitle)
                .fontWeight(.light)
                .foregroundStyle(theme.text)
                .tracking(4)
                .opacity(showTitle ? 1 : 0)
                .offset(y: showTitle ? 0 : 10)
        }
    }

    // MARK: - Form Card

    private var formCard: some View {
        VStack(spacing: 16) {
            TextField("Email", text: $email)
                .textContentType(.emailAddress)
                .textInputAutocapitalization(.never)
                .keyboardType(.emailAddress)
                .autocorrectionDisabled()
                .foregroundStyle(theme.text)
                .focused($focusedField, equals: .email)
                .themedTextField(isFocused: focusedField == .email)

            SecureField("Password", text: $password)
                .textContentType(.password)
                .foregroundStyle(theme.text)
                .focused($focusedField, equals: .password)
                .themedTextField(isFocused: focusedField == .password)

            if let error = auth.error {
                Text(error)
                    .font(.caption)
                    .foregroundStyle(Color(hex: "#ef4444"))
                    .multilineTextAlignment(.center)
                    .transition(.move(edge: .top).combined(with: .opacity))
            }

            Button {
                isSubmitting = true
                Task {
                    await auth.signIn(email: email, password: password)
                    isSubmitting = false
                }
            } label: {
                Group {
                    if isSubmitting {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Text("Sign In")
                            .fontWeight(.semibold)
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(14)
                .background(theme.primaryGradient, in: RoundedRectangle(cornerRadius: 12))
                .foregroundStyle(.white)
            }
            .disabled(email.isEmpty || password.isEmpty || isSubmitting)
            .opacity(email.isEmpty || password.isEmpty ? 0.5 : 1)
            .scaleEffect(isPressed ? 0.96 : 1.0)
            .onLongPressGesture(minimumDuration: .infinity, pressing: { pressing in
                withAnimation(.easeInOut(duration: 0.15)) {
                    isPressed = pressing
                }
            }, perform: {})
        }
        .padding(24)
        .glassCard()
        .padding(.horizontal, 24)
        .opacity(showForm ? 1 : 0)
        .offset(y: showForm ? 0 : 20)
        .animation(.default, value: auth.error != nil)
    }
}
