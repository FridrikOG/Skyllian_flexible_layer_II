# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.8
WORKDIR ./skyllian
COPY . .

RUN pip install -r requirements.txt

ENTRYPOINT ["python"]
CMD ["skyllians.py"]