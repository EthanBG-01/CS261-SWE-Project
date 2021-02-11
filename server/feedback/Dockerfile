FROM python:3.7-alpine

WORKDIR /project

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5003

CMD ["python","feedback-service.py"]