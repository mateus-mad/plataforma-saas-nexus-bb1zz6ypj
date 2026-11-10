#!/usr/bin/env bash
set -euo pipefail
# MAD Engenharia — staging do ERP.ORBIX como fonte (não faz merge e não executa banco).
# Execute na cópia local do repositório Skip, em branch de trabalho.
ROOT="$(git rev-parse --show-toplevel)"
SOURCE="https://github.com/mateus-mad/daily-clock-smart.git"
SHA="ddbfa261804a740458b89c0234f454205df5e828"
TARGET="$ROOT/vendor/erp-orbix"
if [ -e "$TARGET" ]; then
  echo "ABORTADO: destino já existe: $TARGET" >&2
  exit 2
fi
if ! git -C "$ROOT" branch --show-current | grep -q '^migration/'; then
  echo "ABORTADO: usar branch migration/* antes de executar." >&2
  exit 2
fi
mkdir -p "$ROOT/vendor"
git -C "$ROOT" submodule add "$SOURCE" vendor/erp-orbix
git -C "$TARGET" checkout --detach "$SHA"
git -C "$ROOT" add .gitmodules vendor/erp-orbix
echo "Fonte ORBIX vinculada ao commit $SHA em vendor/erp-orbix."
echo "IMPORTANTE: nenhuma funcionalidade foi ativada, nenhum banco migrado."
echo "Verifique os arquivos e crie commit somente após conferir."
