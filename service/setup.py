import os
import shutil

from cx_Freeze import Executable, setup

exe = Executable(
    script="runner.py",
    base=None,
    target_name="service-x86_64-pc-windows-msvc.exe",
)

setup(
    executables=[exe],
    options={
        "build_exe": {
            "excludes": ["test", "setuptools"],
            "packages": ["uvicorn"],
            "includes": ["app.main"],
            "include_msvcr": True,
        },
    },
)

# Move the executable to the build/bin directory
os.makedirs("build/bin", exist_ok=True)
shutil.move(
    "build/exe.win-amd64-3.11/service-x86_64-pc-windows-msvc.exe",
    "build/bin/service-x86_64-pc-windows-msvc.exe",
)
