flowchart TD
    A[User visits any page] --> MW{Middleware Check}

    subgraph Public Routes
        direction LR
        P1[/]
        P2[/login]
        P3[/auth/callback]
        P4[/privacy]
        P5[/terms]
        P6[Static Assets]
    end

    MW -- Public Route --> Allow(Allow Access)

    MW -- Protected Route --> AuthCheck{Authenticated?}

    AuthCheck -- No --> RedirectLogin(Redirect to /login)
    RedirectLogin --> LoginPage[/login Page]
    LoginPage -- Login Attempt --> SupabaseAuth[Supabase Auth (Google/Email)]
    SupabaseAuth -- Success --> Callback[/auth/callback]
    Callback --> SetCookie[Set Session Cookie]
    SetCookie --> RedirectHome(Redirect to /)
    SupabaseAuth -- Failure --> LoginPage

    AuthCheck -- Yes --> DomainCheck{Email @sensay.io?}

    DomainCheck -- Yes --> AllowSensay(Allow Access)
    AllowSensay --> SensayUserView[/ or /prototypes/*]
    SensayUserView --> Sidebar[Show Sidebar]
    Sidebar --> PrototypeView[Prototype Pages]
    PrototypeView --> Interactions[Mock Interactions]

    DomainCheck -- No --> PathCheck{Target /prototypes/*?}
    PathCheck -- Yes --> RedirectOverview(Redirect to /overview)
    PathCheck -- No --> AllowNonSensay(Allow Access)
    AllowNonSensay --> NonSensayUserView[/ or /overview]
    RedirectOverview --> NonSensayUserView
    NonSensayUserView --> NoSidebar[Hide Sidebar]

    UserAction[User Action (e.g., Click Sign Out)] --> SignOutFunc[SignOutButton Click]
    SignOutFunc --> SupabaseSignOut[Supabase auth.signOut()]
    SupabaseSignOut --> ReloadHome[Full Page Reload to /]