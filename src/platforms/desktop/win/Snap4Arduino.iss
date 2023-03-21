; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define LINOAppNome "PatruLINO-IDE"
#define LINOVersaoNOME "PatruLINO-IDE"
#define LINOVersao "1.0"
#define LINOPublisher "PatrulhaEUREKA.org"
#define LINOUrl "https://www.patrulhaeureka.org"
#define LINOEXE "PatruLINO-IDE.exe"


[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{79712027-5DAE-425B-8534-1CA699720EA5}
AppName={#LINOAppNome}
AppVersion={#LINOVersao}
AppVerName={#LINOVersaoNOME}-{#LINOVersao}
AppPublisher={#LINOPublisher}
AppPublisherURL={#LINOUrl}
AppSupportURL={#LINOUrl}
AppUpdatesURL={#LINOUrl}
DefaultDirName={pf}\PatruLINO-IDE
DefaultGroupName=PatruLINO-IDE
AllowNoIcons=no
Password=eureka@ja
OutputDir=.
OutputBaseFilename=PatruLINO-IDE-{#LINOVersao}-@Architecture
SetupIconFile=s4a.ico
Compression=lzma
SolidCompression=yes

[Languages]
Name: "portuges"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 0,6.1

[Files]
Source: "*.*"; Excludes: "Snap4Arduino.iss"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{group}\{#LINOAppNome}"; Filename: "{app}\{#LINOEXE}"; IconFilename: "{app}\s4a.ico"; WorkingDir: "{app}"
Name: "{group}\{cm:ProgramOnTheWeb,{#LINOAppNome}}"; Filename: {#LINOUrl}
Name: "{group}\{cm:UninstallProgram,{#LINOAppNome}}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\{#LINOAppNome}"; Filename: "{app}\{#LINOEXE}"; IconFilename: "{app}\s4a.ico"; Tasks: desktopicon; WorkingDir: "{app}"
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#LINOAppNome}"; Filename: "{app}\{#LINOEXE}"; Tasks: quicklaunchicon; WorkingDir: "{app}"

[Run]
Filename: "{app}\{#LINOEXE}"; Description: "{cm:LaunchProgram,{#LINOAppNome}}"; Flags: nowait postinstall skipifsilent
