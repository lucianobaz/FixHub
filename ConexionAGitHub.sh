#!/bin/bash
# -------------------------
# CONFIGURACION DE GITHUB EN MAC Y WINDOWS
# -------------------------
echo "SETUP GITHUB - MAC Y WINDOWS"



# -------------------------
# PASO 1 - DETECTAR SISTEMA OPERATIVO
# -------------------------

OS="$(uname)"

# si el usuario esta en Windows con Git Bash, se detecta como MINGW o MSYS, si es Mac/Linux se detecta como Darwin o Linux
if [[ "$OS" == *"MINGW"* ]] || [[ "$OS" == *"MSYS"* ]]; then
    echo "S.O Detectado: Windows (Git Bash)"
    DESKTOP="$HOME/Desktop"

else
# si no es Windows, entonces es Mac o Linux
    echo "S.O Detectado: Mac/Linux"
    DESKTOP="$HOME/Desktop"
fi



# -------------------------
# PASO 2 - CONFIGURAR USUARIO
# -------------------------

# solicitamos al usuario su nombre de usuario y email de GitHub
read -p "🧑🏼‍💻 Ingrese su nombre de usuario de GitHub: " username
read -p "📩 Ingrese el email con el que registro esa misma cuenta de GitHub: " email

# configurar usuario y email globalmente para git
git config --global user.name "$username"
git config --global user.email "$email"
echo "Git configurado, verificando si existe una clave SSH"




# -------------------------
# PASO 3 - CREAR O USAR CLAVE SSH
# -------------------------

#si el usuario ya tiene una clave SSH, le preguntamos si quiere usarla o crear una nueva
echo ""
if [ -f ~/.ssh/id_ed25519 ]; then
    echo "🔐 Ya existe una clave SSH"

    read -p "👉 ¿Quieres usarla? (escribir y/n): " usar

#si el usuario quiere usar la clave existente, mostramos la clave pública.
    if [ "$usar" = "y" ]; then
        echo "📋 Tu clave actual es:"
        cat ~/.ssh/id_ed25519.pub

    else
    # si el usuario no quiere usar la clave existente, le creamos una nueva.
        read -p "🔑 Ingrese un nombre para la nueva clave: " keyname

    # generamos la nueva clave SSH con el nombre ingresado por el usuario
        echo "🔄 Generando nueva clave..."
        ssh-keygen -t ed25519 -C "$email" -f ~/.ssh/$keyname

    # mostramos la nueva clave pública
        echo "📋 Nueva clave: "
        cat ~/.ssh/$keyname.pub

    # recordamos al usuario que debe copiar la nueva clave en GitHub
        echo "⚠️ Debes copiar esta clave en Configuracion de GitHub > Llaves SSH"
    fi

else # si el usuario no tiene una clave SSH, le creamos una nueva.
    echo "🔐 No tienes clave SSH creadas, creando una..."
    ssh-keygen -t ed25519 -C "$email"

    echo "📋 Tu clave es:"
    cat ~/.ssh/id_ed25519.pub
    echo "⚠️ Debes copiar esta clave en Configuracion de GitHub > Llaves SSH"
fi

# recordamos al usuario que debe copiar la clave en GitHub
echo ""
read -p "👉 Presiona ENTER cuando hayas agregado la clave a GitHub, el programa va a ejecutar una prueba de conexión."



# -------------------------
# PROBAR CONEXIÓN
# -------------------------

echo "🔗 Probando conexión con GitHub..."
ssh -T git@github.com


# -------------------------
# CARPETA DESTINO (DESKTOP)
# -------------------------

echo ""
read -p "📁 Nombre de la carpeta en el Escritorio: " folder_name

if [ -z "$folder_name" ]; then
    folder_name="repo_git"
fi

TARGET="$DESKTOP/$folder_name"

if [ ! -d "$TARGET" ]; then
    echo "📁 Creando carpeta..."
    mkdir -p "$TARGET"
fi

cd "$TARGET" || exit

echo "📂 Usando carpeta: $TARGET"



# -------------------------
# CLONAR O ACTUALIZAR REPO
# -------------------------

read -p "📦 Pegue aqui el link del repositorio (si no tenes uno debes crearlo en GitHub): " repo

if [ -d "$TARGET/.git" ]; then
    echo "🔄 El repositorio ya existe, haciendo pull..."
    cd "$TARGET" || exit
    git pull
else
    if [ -n "$(find "$TARGET" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
        echo "⚠️ La carpeta ya existe y no está vacía. No se clonará el repositorio aquí."
        echo "👉 Elegí otro nombre de carpeta o vacía la carpeta anterior."
        exit 1
    fi

    echo "📦 Clonando repositorio..."
    git clone "$repo" "$TARGET"
    cd "$TARGET" || exit
fi

echo "✅ Repo listo en: $TARGET"



# -------------------------
# CREACION DEL SCRIPT AUTO COMMIT
# -------------------------

cat << 'EOF' > auto_commit.sh
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
EOF

chmod +x auto_commit.sh

echo "⚙️ Script auto_commit.sh creado"

# -------------------------
# FINAL
# -------------------------

echo ""
echo "🎉 TODO LISTO"
echo "👉 Para subir los cambios a GitHub debes ejecutar auto_commit.sh"