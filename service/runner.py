import multiprocessing

import uvicorn

from app import log_conf

multiprocessing.freeze_support()
uvicorn.run("app.main:app", host="127.0.0.1", port=8040, log_config=log_conf)
