' FILE: contar_archivos.vbs
Option Explicit

Dim fso, folder, folderPath, totalCount

Set fso = CreateObject("Scripting.FileSystemObject")

' Carpeta a analizar
folderPath = "C:\Users\baa4ts\Desktop\Mirnov"

If Not fso.FolderExists(folderPath) Then
    WScript.Echo "La carpeta no existe: " & folderPath
    WScript.Quit
End If

Set folder = fso.GetFolder(folderPath)

totalCount = 0
Dim file
For Each file In folder.Files
    totalCount = totalCount + 1
Next

WScript.Echo "Número total de archivos (sin subcarpetas): " & totalCount
