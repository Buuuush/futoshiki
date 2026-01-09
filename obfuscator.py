import re
import os
import sys
import base64
import random
import string
from pathlib import Path


class FileObfuscator:
    def __init__(self):
        self.var_mapping = {}
        self.class_mapping = {}
        self.id_mapping = {}
        
    def generate_random_name(self, length=8):
        return ''.join(random.choices(string.ascii_letters, k=length))
    
    def obfuscate_javascript(self, js_code):
        print("  [JS] Obfuscation en cours...")
        js_code = re.sub(r'//.*?$', '', js_code, flags=re.MULTILINE)
        js_code = re.sub(r'/\*.*?\*/', '', js_code, flags=re.DOTALL)
        js_code = re.sub(r'\s+', ' ', js_code)
        js_code = re.sub(r'\s*([{};,:])\s*', r'\1', js_code)
        
        def encode_string(match):
            string_content = match.group(0)
            try:
                encoded = ''.join([f'\\x{ord(c):02x}' for c in string_content[1:-1]])
                return f'{string_content[0]}{encoded}{string_content[0]}'
            except:
                return string_content
        
        js_code = re.sub(r'"[^"]*"', encode_string, js_code)
        js_code = re.sub(r"'[^']*'", encode_string, js_code)
        var_pattern = r'\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b'
        
        def replace_var(match):
            var_type = match.group(1)
            var_name = match.group(2)
            if var_name not in self.var_mapping:
                reserved = ['console', 'window', 'document', 'this', 'function', 'return']
                if var_name not in reserved:
                    self.var_mapping[var_name] = '_0x' + ''.join(random.choices('0123456789abcdef', k=6))
            return f"{var_type} {self.var_mapping.get(var_name, var_name)}"
        
        js_code = re.sub(var_pattern, replace_var, js_code)
        
        for original, obfuscated in self.var_mapping.items():
            js_code = re.sub(r'\b' + original + r'\b', obfuscated, js_code)
        
        return js_code
    
    def obfuscate_html(self, html_code):
        print("  [HTML] Obfuscation en cours...")
        html_code = re.sub(r'<!--.*?-->', '', html_code, flags=re.DOTALL)
        
        def replace_html_class(match):
            classes = match.group(1).split()
            obfuscated_classes = []
            for cls in classes:
                if cls not in self.class_mapping:
                    self.class_mapping[cls] = 'c' + self.generate_random_name(6)
                obfuscated_classes.append(self.class_mapping[cls])
            return f'class="{" ".join(obfuscated_classes)}"'
        
        html_code = re.sub(r'class="([^"]+)"', replace_html_class, html_code)
        html_code = re.sub(r"class='([^']+)'", replace_html_class, html_code)
        
        def replace_html_id(match):
            id_name = match.group(1)
            if id_name not in self.id_mapping:
                self.id_mapping[id_name] = 'i' + self.generate_random_name(6)
            return f'id="{self.id_mapping[id_name]}"'
        
        html_code = re.sub(r'id="([^"]+)"', replace_html_id, html_code)
        html_code = re.sub(r"id='([^']+)'", replace_html_id, html_code)
        html_code = re.sub(r'>\s+<', '><', html_code)
        html_code = re.sub(r'\s+', ' ', html_code)
        script_pattern = r'<script[^>]*>(.*?)</script>'
        
        def replace_inline_script(match):
            script_content = match.group(1)
            obfuscated = self.obfuscate_javascript(script_content)
            return f'<script>{obfuscated}</script>'
        
        html_code = re.sub(script_pattern, replace_inline_script, html_code, flags=re.DOTALL)
        style_pattern = r'<style[^>]*>(.*?)</style>'
        
        def replace_inline_style(match):
            style_content = match.group(1)
            obfuscated = self.obfuscate_css(style_content)
            return f'<style>{obfuscated}</style>'
        
        html_code = re.sub(style_pattern, replace_inline_style, html_code, flags=re.DOTALL)
        return html_code
    
    def obfuscate_file(self, file_path):
        file_path = Path(file_path)
        
        if not file_path.exists():
            print(f"❌ Erreur: Le fichier {file_path} n'existe pas")
            return False
        
        print(f"\n🔒 Obfuscation de: {file_path.name}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            extension = file_path.suffix.lower()
            
            if extension == '.js':
                obfuscated = self.obfuscate_javascript(content)
            elif extension in ['.html', '.htm']:
                obfuscated = self.obfuscate_html(content)
            else:
                print(f"❌ Extension non supportée: {extension}")
                return False
            
            output_path = file_path.parent / f"{file_path.stem}.obfuscated{extension}"
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(obfuscated)
            
            print(f"✅ Fichier obfusqué créé: {output_path.name}")
            original_size = len(content)
            obfuscated_size = len(obfuscated)
            reduction = ((original_size - obfuscated_size) / original_size * 100) if original_size > 0 else 0
            
            print(f"   Taille originale: {original_size} octets")
            print(f"   Taille obfusquée: {obfuscated_size} octets")
            print(f"   Réduction: {reduction:.1f}%")
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de l'obfuscation: {str(e)}")
            return False
    
    def obfuscate_directory(self, directory_path):
        directory_path = Path(directory_path)
        
        if not directory_path.is_dir():
            print(f"❌ Erreur: {directory_path} n'est pas un répertoire")
            return
        
        print(f"\n📁 Obfuscation du répertoire: {directory_path}")
        
        supported_extensions = ['.html', '.htm', '.js']
        files = []
        
        for ext in supported_extensions:
            files.extend(directory_path.glob(f'*{ext}'))
        
        if not files:
            print("❌ Aucun fichier supporté trouvé dans ce répertoire")
            return
        
        print(f"📄 {len(files)} fichier(s) trouvé(s)")
        
        success_count = 0
        for file_path in files:
            if self.obfuscate_file(file_path):
                success_count += 1
        
        print(f"\n✨ Terminé! {success_count}/{len(files)} fichier(s) obfusqué(s) avec succès")


def main():
    print("=" * 60)
    print("🔐 OBFUSCATEUR DE CODE - HTML, JavaScript")
    print("=" * 60)
    
    obfuscator = FileObfuscator()
    
    if len(sys.argv) < 2:
        print("\n📖 Utilisation:")
        print(f"  python {sys.argv[0]} <fichier_ou_répertoire>")
        print("\nExemples:")
        print(f"  python {sys.argv[0]} script.js")
        print(f"  python {sys.argv[0]} index.html")
        print(f"  python {sys.argv[0]} ./mon_projet/")
        print("\nExtensions supportées: .html, .htm, .js")
        return
    
    target = sys.argv[1]
    target_path = Path(target)
    
    if target_path.is_file():
        obfuscator.obfuscate_file(target_path)
    elif target_path.is_dir():
        obfuscator.obfuscate_directory(target_path)
    else:
        print(f"❌ Erreur: {target} n'existe pas")
        return
    
    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
