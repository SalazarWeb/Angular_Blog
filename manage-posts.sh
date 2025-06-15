generate_posts_index() {
    echo "Generando índice de posts automáticamente..."
    
    POSTS_DIR="src/assets/markdown"
    INDEX_FILE="src/assets/posts-index.json"
    
    echo "[" > "$INDEX_FILE"
    
    first=true
    
    for file in "$POSTS_DIR"/*.md; do
        if [ -f "$file" ]; then
            basename=$(basename "$file" .md)
            
            if [ "$first" = true ]; then
                first=false
            else
                echo "," >> "$INDEX_FILE"
            fi
            
            echo "  {" >> "$INDEX_FILE"
            echo "    \"id\": \"$basename\"," >> "$INDEX_FILE"
            echo "    \"fileName\": \"$basename.md\"" >> "$INDEX_FILE"
            echo -n "  }" >> "$INDEX_FILE"
        fi
    done
    
    echo "" >> "$INDEX_FILE"
    echo "]" >> "$INDEX_FILE"
    
    echo "✅ Índice de posts generado exitosamente en $INDEX_FILE"
    echo "📝 Posts encontrados:"
    cat "$INDEX_FILE"
}

create_new_post() {
    echo "📝 Creando nuevo post..."
     
    read -p "Título del post: " title
    read -p "Categoría (tecnología/experiencias): " category
    read -p "Subcategoría: " subcategory
    read -p "Tags (separados por comas): " tags_input
    read -p "Resumen: " summary
     
    post_id=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
     
    current_date=$(date +"%Y-%m-%d")
     
    IFS=',' read -ra TAGS_ARRAY <<< "$tags_input"
    tags_yaml=""
    for tag in "${TAGS_ARRAY[@]}"; do
        tag=$(echo "$tag" | xargs) # trim espacios
        tags_yaml="$tags_yaml  - $tag"$'\n'
    done
    
    # Crear contenido del post
    cat > "src/assets/markdown/$post_id.md" << EOF
---
title: "$title"
date: $current_date
category: "$category"
subcategory: "$subcategory"
tags: 
$tags_yaml
coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop"
summary: "$summary"
---

## Introducción Emocional
![Imagen descriptiva](https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop)
*Descripción de la imagen - Foto propia*

Aquí va tu introducción emocional que conecte con el lector...

## Sección Principal Flexible
### Contexto Necesario
- Punto importante sobre el contexto
- ¿Por qué es relevante ahora?
- Dato interesante o estadística

### Experiencia Personal
Tu experiencia personal relacionada con el tema...

Las lecciones más valiosas que aprendiste:
- Lección 1
- Lección 2
- Lección 3

Momentos destacados:
- Momento 1
- Momento 2
- Momento 3

### Consejos Prácticos
1. **Consejo principal**: Explicación detallada
2. **Lo que desearía haber sabido**: Insight valioso
3. **Errores a evitar**: Advertencias importantes

## Reflexión Final
Tu reflexión final sobre el tema y cómo se aplica más allá del contexto específico...

Esta experiencia se extiende a otros ámbitos porque...

---
EOF

    echo "✅ Post creado: src/assets/markdown/$post_id.md"
    echo "🔄 Regenerando índice de posts..."
    generate_posts_index
    echo "🎉 ¡Listo! Tu nuevo post ya está disponible en el blog."
}

# Función principal
main() {
    echo "🚀 Blog Post Manager"
    echo "==================="
    echo "1. Generar índice de posts automáticamente"
    echo "2. Crear nuevo post con template"
    echo "3. Salir"
    echo ""
    read -p "Selecciona una opción (1-3): " option
    
    case $option in
        1)
            generate_posts_index
            ;;
        2)
            create_new_post
            ;;
        3)
            echo "👋 ¡Hasta luego!"
            exit 0
            ;;
        *)
            echo "❌ Opción no válida"
            main
            ;;
    esac
}

# Verificar que estamos en el directorio correcto
if [ ! -f "angular.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto Angular"
    exit 1
fi

# Ejecutar función principal
main