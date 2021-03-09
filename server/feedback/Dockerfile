FROM python:3.7.4

WORKDIR /project

COPY requirements.txt .

RUN python3.7 -m pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5003

CMD ["python","feedback-service.py"]
