"""Keep the flat service modules importable however pytest is invoked."""

import sys
from pathlib import Path

SERVICE_ROOT = Path(__file__).resolve().parent
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))
