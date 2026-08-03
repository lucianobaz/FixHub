#!/bin/bash

# Asegurar que estamos en el repo
if [ ! -d ".git" ]; then
    echo "❌ Este no es un repositorio Git"
    exit 1
fi

if [[ -z $(git status -s) ]]; then
    echo "🚫 No hay cambios para subir"
    exit 0
fi

git status

echo ""
read -p "✏️ Ingrese el mensaje del commit: " mensaje

if [ -z "$mensaje" ]; then
    mensaje="auto commit $(date '+%Y-%m-%d %H:%M:%S')"
fi

git add .
git commit -m "$mensaje"
git push

echo "✅ Cambios subidos correctamente"
